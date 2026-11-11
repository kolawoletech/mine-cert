import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Health and API documentation', () => {
  let app: INestApplication;
  const queryRaw = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ $queryRaw: queryRaw })
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(() => {
    queryRaw.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves liveness without requiring database access', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health/live')
      .expect(200)
      .expect({ status: 'ok' });

    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('serves readiness when the database responds', async () => {
    queryRaw.mockResolvedValue(1);

    await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200)
      .expect({ status: 'ok', checks: { database: 'ok' } });
  });

  it('returns 503 when the database is unavailable', async () => {
    queryRaw.mockRejectedValue(new Error('Connection refused'));

    await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(503);
  });

  it('publishes the health routes in the OpenAPI document', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);

    expect(response.body.paths).toHaveProperty('/api/v1/health/live');
    expect(response.body.paths).toHaveProperty('/api/v1/health/ready');
  });
});
