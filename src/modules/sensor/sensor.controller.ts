import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { SensorService } from './sensor.service';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() dto: CreateSensorDto) {
    return this.sensorService.create(dto);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  findAll() {
    return this.sensorService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sensorService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSensorDto) {
    return this.sensorService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sensorService.remove(id);
  }
}
