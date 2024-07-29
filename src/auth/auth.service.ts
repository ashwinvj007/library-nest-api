import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find(); // Use .find() to get all users
      return users;
    } catch (error) {
      // Handle any potential errors (e.g., database connection issues)
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  // async updateUser(id: string, updateUserDto: UpdateUserDto) {
  //   const { name, email, password } = updateUserDto;
  
  //   // Create an object to hold the updated fields
  //   const updateData: any = {};
  
  //   // Only add fields to updateData if they are provided in the DTO
  //   if (name) updateData.name = name;
  //   if (email) updateData.email = email;
  
  //   // If a new password is provided, hash it before updating
  //   if (password) {
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     updateData.password = hashedPassword;
  //   }
  
  //   // Find the user by ID and update their information
  //   const updatedUser = await this.userModel.findByIdAndUpdate(
  //     id,
  //     updateData,
  //     { new: true, runValidators: true }
  //   );
  
  //   if (!updatedUser) {
  //     throw new NotFoundException('User not found');
  //   }
  
  //   // Generate a new token with the updated user information
  //   const token = this.jwtService.sign({ id: updatedUser._id });
  
  //   return { user: updatedUser, token };
  // }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = { ...updateUserDto };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({ id: updatedUser._id });

    return { user: updatedUser, token };
  }
  
  
  
  
  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return ;
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };

  }

  
}