import { Model, Document } from 'mongoose';
import { ProgressItem } from '../../../src/modules/user';
import { ExerciseItem, Routine } from '../../../src/modules/routine';
import { UserPayload } from '../../../src/modules';

export interface IUserDocument extends UserPayload, Document {
  hashedPassword: string;
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => string;
  generateToken: () => string;
}

export interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Promise<IUserDocument>;
}