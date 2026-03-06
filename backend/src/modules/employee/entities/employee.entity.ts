import { Department } from 'src/modules/department/entities/department.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('numeric', { precision: 10, scale: 2, nullable: true })
  salary: number;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @CreateDateColumn()
  created_at: Date;
}