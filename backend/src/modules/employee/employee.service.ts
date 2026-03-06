import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Department } from '../department/entities/department.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const { departmentId, ...rest } = dto;

    const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
    if (!department) throw new NotFoundException(`Department #${departmentId} not found`);

    const employee = this.employeeRepository.create({ ...rest, department });
    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['department'] });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!employee) throw new NotFoundException(`Employee #${id} not found`);
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    const { departmentId, ...rest } = dto;

    if (departmentId) {
      const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
      if (!department) throw new NotFoundException(`Department #${departmentId} not found`);
      employee.department = department;
    }

    Object.assign(employee, rest);
    return this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<{ message: string }> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    return { message: `Employee deleted successfully` };
  }
}
