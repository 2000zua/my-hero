import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Language, Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from "nestjs-prisma";
import { AppConfigService } from 'src/config/app/app-config.service';
import { Token } from './token.model';
import { PublicErrors } from 'src/shared/enums/public-errors.enum';
import { SignupInput } from './dto/signup.input';
import { AuthErrors } from './enums/auth-errors';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly appConfig: AppConfigService,
  ){}

  // validar a senha recebida com a senha no banco em hash
  static validatePassword(password: string, hashedPassword: string): Promise<boolean>{
    return compare(password, hashedPassword);
  }

  //criar umau  funcao para signUp
  async signup(payload: SignupInput, language: Language): Promise<Token> {
    const hashedPasword = await this.hashPassword(payload.password)
    
    try {
      /// criar um novo user
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          language,
          password: hashedPasword,
        }
      });

      return this.generateTokens({
        userId: user.id
      });

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError && 
        error.errorCode === AuthErrors.USER_DUPLICATED
      ){
        throw new ConflictException({
          code: PublicErrors.USER_DUPLICATED,
          message: `Email ${payload.email} ja cadastrado`,
        });
      }else{
        throw new Error(error);
      }
    }
  }

  // login entrar no sistema
  async login(emailUser: string, passwordUser: string): Promise<Token>{
    
    const user = await this.prisma.user.findUnique({where: {email: emailUser}}); // depois incluir o hero :true

    if(!user){
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: 'Credencias Invalidas',
      });
    }

    const passwordValid = await AuthService.validatePassword(passwordUser, user.password);
    
    if(!passwordValid){
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: 'Credencias Invalidas',
      });
    }

    const tokens = this.generateTokens({
      userId: user.id,
    });

    return {
      ...tokens, ...user
    };
  }

  // eliminar a conta
  async deleteAccount (user: User, password: string) {
    const passwordValid = await AuthService.validatePassword(password, user.password);

    if(!passwordValid){
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: 'Credencias Invalidas',
      });
    }

    await this.prisma.user.delete({
      where: { id: user.id}
    });

    return {ok: true};
  }

  // refresh token
  async refreshToken(token: string): Promise<Token>{
    try {
      const { userId } = this.jwtService.verify(token,  {
        secret: this.appConfig.jwtRefreshSecret,
      });
      return this.generateTokens({userId});
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // gerarTokens
  generateTokens(payload: {userId: string}): Token{
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };    
  }

  // funcao para pegar o usario 
  getUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({where: {id: userId}});
  }

  //pegar o usuario atravez do token gerado
  getUserFromToken(token: string): Promise<any>{
    const id = this.jwtService.decode(token)['userId'];
    return this.getUser(id); 
  }

  // gerarum hash para senha
  hashPassword(password: string): Promise<string>{
    return hash(password, this.appConfig.bcryptSaltRounds);
  }

  // gerarum token de acessp
  private generateAccessToken(payload: {userId: string}): string{
    return this.jwtService.sign(payload);
  }

  //gactualizar o token num certo periodo
  private generateRefreshToken(payload: {userId: string}): string{
    return this.jwtService.sign(payload, {
      secret: this.appConfig.jwtRefreshSecret,
      expiresIn: this.appConfig.jwtRefreshIn
    });
  }


}
