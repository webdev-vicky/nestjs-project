import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletService } from '../wallet/wallet.service';
export declare class UserService {
    private userRepository;
    private walletService;
    constructor(userRepository: Repository<User>, walletService: WalletService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    suspend(id: number): Promise<User>;
    activate(id: number): Promise<User>;
}
