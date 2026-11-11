import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({ summary: 'Check whether the API process is running' })
  @ApiOkResponse({ description: 'The API process is running.' })
  live(): { status: 'ok' } {
    return this.healthService.live();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check whether the API can serve requests' })
  @ApiOkResponse({ description: 'The API and database are ready.' })
  @ApiServiceUnavailableResponse({
    description: 'The database is unavailable.',
  })
  ready(): Promise<{ status: 'ok'; checks: { database: 'ok' } }> {
    return this.healthService.ready();
  }
}
