import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from "nestjs-prisma";


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ){}

  // validar a senha recebida com a senha no banco em hash
  static validatePassword(password: string, hashedPassword: string): Promise<boolean>{
    return compare(password, hashedPassword);
  }

  //pegar o usuario atravez do token gerado
  getUserFromToken(token: string): Promise<any>{
    const id = this.jwtService.decode(token)['userId'];
    return id; // return o usuario travez do id this.getUser(id)
  }

  // gerarum hash para senha
  hashPassword(password: string): Promise<string>{
    // TODO O 10 deve ser exportado apartir do arquivo appcongig
    return hash(password, 10);
  }

  // gerarum token de acessp
  private generateAccessToken(payload: {userId: string}){
    return this.jwtService.signAsync(payload);
  }

  //gactualizar o token num certo periodo
  private generateRefreshToken(payload: {userId: string}): string{
    return this.jwtService.sign(payload, {
      secret: 'zua10',
      expiresIn: '10 dias'
    });
  }


}
