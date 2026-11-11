import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;
  let queryRaw: jest.Mock;

  beforeEach(() => {
    queryRaw = jest.fn();
    healthService = new HealthService({
      $queryRaw: queryRaw,
    } as unknown as PrismaService);
  });

  it('reports liveness without querying the database', () => {
    expect(healthService.live()).toEqual({ status: 'ok' });
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('reports readiness when the database responds', async () => {
    queryRaw.mockResolvedValue(1);

    await expect(healthService.ready()).resolves.toEqual({
      status: 'ok',
      checks: { database: 'ok' },
    });
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it('returns a service-unavailable error when the database check fails', async () => {
    queryRaw.mockRejectedValue(new Error('Connection refused'));

    await expect(healthService.ready()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
