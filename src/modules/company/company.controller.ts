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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

// TODO: Update guards
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.remove(id);
  }
}
