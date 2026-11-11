import { environmentValidationSchema } from './environment';

describe('environmentValidationSchema', () => {
  it('requires a PostgreSQL connection URL', () => {
    const { error } = environmentValidationSchema.validate({});

    expect(error?.details[0].path).toEqual(['DATABASE_URL']);
  });

  it('rejects non-PostgreSQL connection URLs', () => {
    const { error } = environmentValidationSchema.validate({
      DATABASE_URL: 'https://example.com',
    });

    expect(error?.details[0].path).toEqual(['DATABASE_URL']);
  });

  it('provides defaults for the runtime mode and port', () => {
    const { error, value } = environmentValidationSchema.validate({
      DATABASE_URL:
        'postgresql://minecert:minecert@localhost:5435/minecert',
    });

    expect(error).toBeUndefined();
    expect(value).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3001,
    });
  });
});
