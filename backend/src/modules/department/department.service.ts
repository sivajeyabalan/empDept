import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const dept = this.departmentRepository.create(dto);
    return this.departmentRepository.save(dept);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({ relations: ['employees'] });
  }

  async findOne(id: string): Promise<Department> {
    const dept = await this.departmentRepository.findOne({
      where: { id },
      relations: ['employees'],
    });
    if (!dept) throw new NotFoundException(`Department #${id} not found`);
    return dept;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findOne(id);
    Object.assign(dept, dto);
    return this.departmentRepository.save(dept);
  }

  async remove(id: string): Promise<{ message: string }> {
    const dept = await this.findOne(id);

    if (dept.employees && dept.employees.length > 0) {
      throw new BadRequestException(
        `Cannot delete department "${dept.name}" — it still has ${dept.employees.length} employee(s). Reassign or remove them first.`,
      );
    }

    await this.departmentRepository.remove(dept);
    return { message: `Department deleted successfully` };
  }
}
