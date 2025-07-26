import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Section, Shape } from "@/components";
import { Eye, EyeSlash } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionBox } from "@/components";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [value] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  });

  const onSubmit = (values) => {
    console.log(values);
    reset();
  };

  return (
    <>
      <SectionBox className="pt-0">
        <Image src="src\assets\logo.jpg" className="w-48 justify-self-center" />
        <h3 className="font-bold text-center py-2">Entre na sua conta</h3>
        <div className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div>
              <InputLabel>CPF ou CNPJ</InputLabel>
              <InputRoot >
                <InputField placeholder="Digite seu CPF ou CNPJ"  {...register("cpf_cnpj", {
                  required: true,
                  onChange: (e) => { e.target.value = maskCpfCnpj(e.target.value) }
                })} />
              </InputRoot>
              <InputMessage className="text-danger-base">{errors.cpf_cnpj?.message}</InputMessage>
            </div>
            <div className="pt-4">
              <InputLabel>Senha</InputLabel>
              <InputRoot >
                <InputField type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" {...register("senha", { required: true })} />
                {showPassword ? <Eye className="icon" onClick={() => setShowPassword((prev) => !prev)} /> : <EyeSlash className="icon" onClick={() => setShowPassword((prev) => !prev)} />}
              </InputRoot>
              <InputMessage className="text-danger-base">{errors.senha?.message}</InputMessage>
            </div>
            <p className="font-bold text-right cursor-pointer text-blue-tx">Esqueceu a senha?</p>
            <div className="pt-4 pb-20">
              <Button className={"bg-red-tx"} type="submit">
                <ButtonText className="text-center text-white">
                  Entrar
                </ButtonText>
              </Button>
            </div>
          </form>
          <div className="justify-items-center">
            <p className="text-center cursor-default">Não possui uma conta Teruel Express?</p>
            <Link to="/login" className="text-red-tx font-bold">
              Crie uma agora
            </Link>
          </div>
        </div>
      </SectionBox>
    </>
  );

}

function maskCpfCnpj(value) {
  const onlyDigits = value.replace(/\D/g, '');

  if (onlyDigits.length <= 11) {
    return onlyDigits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return onlyDigits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  }
}

const loginSchema = z.object({
  cpf_cnpj: z
    .string()
    .nonempty("Campo obrigatório")

    .refine((val) => val.length === 14 || val.length === 18, {
      message: "CPF ou CNPJ inválido"
    }),
  senha: z
    .string()
    .nonempty("Campo obrigatório")
    .min(8, "A senha tem que ter no minimo 8 caracteres")
});