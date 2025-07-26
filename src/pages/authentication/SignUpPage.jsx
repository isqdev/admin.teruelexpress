import { SectionBox } from "@/components"
import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Shape } from "@/components";
import { Eye, EyeSlash, UserList, Phone, EnvelopeSimple, LockSimpleOpen, CheckCircle, HouseLine } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox"
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function SignUpPage() {
  const [data, setData] = useState("Dados do Formulario em JSON");
  const [isBusiness, setIsBusiness] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAllertModal, setShowAllertModal] = useState(false);

  const schema = isBusiness ? businessSchema : personSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid }
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur"
  });


  const handleChangedPerson = (business) => {
    if (isBusiness !== business) {
      setIsBusiness(business);
    }
  }

  const postForm = (formData) => {
    setData({ ...formData });
    console.log("JSON enviado:", formData);
    setShowSuccessModal(true);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!isValid || !acceptedTerms) {
      setShowAllertModal(true);
      return;
    }
    handleSubmit(postForm)();
  };

  const handleTermsModal = () => {
    setShowTermsModal(true);
  }

  return (
    <>
      <SectionBox>
        <Image src="src\assets\logo.jpg" className="w-48 justify-self-center" />
        <h3 className="justify-self-center cursor-default">Crie sua conta!</h3>
        <div className="grid grid-cols-2 gap-4 py-6">
          <p className="font-bold col-span-2 cursor-default">Escolha uma opção</p>
          <Button className={isBusiness ? "bg-white border border-gray-600" : "bg-blue-tx"} onClick={() => handleChangedPerson(false)}>
            <ButtonText className={isBusiness ? "text-gray-600 text-center" : "text-white text-center"}>
              Pessoa Física
            </ButtonText>
          </Button>
          <Button className={isBusiness ? "bg-blue-tx" : "bg-white border border-gray-600"} onClick={() => handleChangedPerson(true)}>
            <ButtonText className={isBusiness ? "text-white text-center" : "text-gray-600 text-center"}>
              Empresa
            </ButtonText>
          </Button>
        </div>
        <form className="flex flex-col gap-1">
          {isBusiness ? <FormBusiness register={register} errors={errors} touchedFields={touchedFields} /> : <FormPerson register={register} errors={errors} touchedFields={touchedFields} />}

          <div className="flex items-center gap-2 py-4">
            <Checkbox checked={acceptedTerms} onCheckedChange={setAcceptedTerms} className="border-gray-600 data-[state=checked]:bg-blue-500 cursor-pointer" />
            <p className="cursor-default">Aceitar os <span onClick={handleTermsModal} className="font-bold text-blue-tx cursor-pointer">termos e condições</span></p>
          </div>

          <div className="pt-2">
            <Button className="bg-red-tx" type="button" onClick={handleCreateAccount}>
              <ButtonText className="text-center text-white">
                Criar conta
              </ButtonText>
            </Button>
          </div>
        </form>

        <div className="justify-items-center pt-6">
          <p className="text-center cursor-default">Já possui uma conta Teruel Express?</p>
          <Link to="/login" className="text-red-tx font-bold">
            Entre aqui
          </Link>
        </div>
      </SectionBox>

      {showAllertModal && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-3">
            <Shape className="z-2 border border-gray-600 bg-white flex flex-col items-center max-w-sm">
              <p className="mb-4 text-lg font-semibold">Por favor preencher todos os campos!</p>
              <Button className="bg-red-tx" onClick={() => setShowAllertModal(false)}>
                <ButtonText className="text-white text-center">Fechar</ButtonText>
              </Button>
            </Shape>
            <div className="fixed bg-black opacity-70 z-1 h-lvh w-lvw" />
          </div>
        </>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-3">
          <Shape className="z-2 border border-gray-600 bg-white flex flex-col items-center max-w-xs gap-4">
            <CheckCircle className="icon size-24 text-success-light justify-self-center" weight="fill" />
            <h3 className="text-center text-lg font-semibold ">Conta criada</h3>
            <Link to="/home">
              <Button className="bg-white border border-gray-600">
                <HouseLine className="icon text-black" />
                <ButtonText className="text-black">Entrar</ButtonText>
              </Button>
            </Link>
          </Shape>
          <div className="fixed bg-black opacity-70 z-1 h-lvh w-lvw" />
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-3">
          <Shape className="z-2 w-full min-h-screen sm:min-h-0 sm:max-w-lg sm:mx-auto sm:my-20 bg-white sm:rounded-2xl sm:h-fit overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-center text-lg font-semibold ">Termos e condições</h3>
              <p className="text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Button className="bg-white border border-gray-600" onClick={() => setShowTermsModal(false)}>
                <ButtonText className="text-black text-center">Fechar termos</ButtonText>
              </Button>
            </div>
          </Shape>
          <div className="fixed bg-black opacity-70 z-1 h-lvh w-lvw" />
        </div>
      )}
    </>
  )
}

function FormPerson({ register, errors, touchedFields }) {

  return (
    <>
      <FormField
        register={register}
        name="namePerson"
        title="Digite seu nome"
        placeholder="Digite seu nome"
        error={errors.namePerson}
        dirty={touchedFields.namePerson}
        icon={UserList}
        autoComplete="name"
      />

      <FormField
        register={register}
        name="cpf"
        title="CPF"
        placeholder="Digite seu CPF"
        error={errors.cpf}
        dirty={touchedFields.cpf}
        icon={UserList}
        onChangeMask={(v) => maskInput(v, "cpf")}
      />

      <FormField
        register={register}
        name="email"
        title="Email"
        placeholder="Digite seu email"
        error={errors.email}
        dirty={touchedFields.email}
        icon={EnvelopeSimple}
        autoComplete="email"
      />

      <FormField
        register={register}
        name="phone"
        title="Telefone"
        placeholder="Digite seu telefone"
        error={errors.phone}
        dirty={touchedFields.phone}
        icon={Phone}
        onChangeMask={(v) => maskInput(v, "phone")}
        autoComplete="tel"
      />

      <FormField
        register={register}
        name="password"
        title="Senha"
        placeholder="Crie uma senha"
        error={errors.password}
        dirty={touchedFields.password}
        type="password"
        icon={LockSimpleOpen}
        autoComplete="new-password"
      />

      <FormField
        register={register}
        name="confirmPassword"
        title="Confirmar senha"
        placeholder="Confirme sua senha"
        error={errors.confirmPassword}
        dirty={touchedFields.confirmPassword}
        type="password"
        icon={LockSimpleOpen}
        autoComplete="new-password"
      />
    </>
  )
}

function FormBusiness({ register, errors, touchedFields }) {

  return (
    <>
      <FormField
        register={register}
        name="nameBusiness"
        title="Digite o nome da empresa"
        placeholder="Digite o nome da empresa"
        error={errors.nameBusiness}
        dirty={touchedFields.nameBusiness}
        icon={UserList}
      />

      <FormField
        register={register}
        name="cnpj"
        title="CNPJ"
        placeholder="Digite seu CNPJ"
        error={errors.cnpj}
        dirty={touchedFields.cnpj}
        icon={UserList}
        onChangeMask={(v) => maskInput(v, "cnpj")}
      />

      <FormField
        register={register}
        name="email"
        title="Email"
        placeholder="Digite seu email"
        error={errors.email}
        dirty={touchedFields.email}
        icon={EnvelopeSimple}
        autoComplete="email"
      />

      <FormField
        register={register}
        name="phone"
        title="Telefone"
        placeholder="Digite seu telefone"
        error={errors.phone}
        dirty={touchedFields.phone}
        icon={Phone}
        onChangeMask={(v) => maskInput(v, "phone")}
        autoComplete="tel"
      />

      <FormField
        register={register}
        name="password"
        title="Senha"
        placeholder="Crie uma senha"
        error={errors.password}
        dirty={touchedFields.password}
        type="password"
        icon={LockSimpleOpen}
        autoComplete="new-password"
      />

      <FormField
        register={register}
        name="confirmPassword"
        title="Confirmar senha"
        placeholder="Confirme sua senha"
        error={errors.confirmPassword}
        dirty={touchedFields.confirmPassword}
        type="password"
        icon={LockSimpleOpen}
        autoComplete="new-password"
      />
    </>
  )
}

function FormField({ title, placeholder, register, name, error, dirty, type = "text", icon: Icon, onChangeMask, autoComplete = "off" }) {
  let status;
  if (dirty) {
    status = error ? "error" : "validated"
  }
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <InputLabel>{title}</InputLabel>
      <InputRoot status={status}>
        <InputIcon>
          {Icon && <Icon className="icon" />}
        </InputIcon>
        <InputField
          autoComplete={autoComplete}
          placeholder={placeholder}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          {...register(name, onChangeMask ? {
            onChange: (e) => {
              e.target.value = onChangeMask(e.target.value);
            }
          } : {})}
        />
        {type === "password" && (
          <InputIcon onClick={() => setShowPassword((v) => !v)} className="cursor-pointer">
            {showPassword ? <Eye className="icon" /> : <EyeSlash className="icon" />}
          </InputIcon>
        )}
        {status === "validated" && (
          <InputIcon>
            <CheckCircle size={32} className="text-success-base" />
          </InputIcon>
        )}
      </InputRoot>
      <InputMessage className="text-danger-base">{error?.message}</InputMessage>
    </>
  )
}

const personSchema = z.object({
  namePerson: z
    .string()
    .nonempty("Campo obrigatório"),

  cpf: z
    .string()
    .nonempty("Campo obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 11 && cpf.isValid(val), { message: "Documento inválido" }),

  email: z
    .string()
    .nonempty("Campo obrigatório")
    .email("Email inválido"),

  phone: z
    .string()
    .nonempty("Campo obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 10 || val.length === 11, { message: "Telefone inválido" }),

  password: z
    .string()
    .nonempty("Campo obrigatório")
    .max(8, "Máximo de 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), { message: "Deve conter ao menos 1 letra maiúscula" })
    .refine((val) => /[0-9]/.test(val), { message: "Deve conter ao menos 1 número" })
    .refine((val) => /[@#$?]/.test(val), { message: "Deve conter ao menos 1 caractere especial (@, #, $, ?)" }),
  confirmPassword: z.string().nonempty("Campo obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const businessSchema = z.object({
  nameBusiness: z
    .string()
    .nonempty("Campo obrigatório"),

  cnpj: z
    .string()
    .nonempty("Campo obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 14 && cnpj.isValid(val), { message: "Documento inválido" }),

  email: z
    .string()
    .nonempty("Campo obrigatório")
    .email("Email inválido"),

  phone: z
    .string()
    .nonempty("Campo obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 10 || val.length === 11, { message: "Telefone inválido" }),

  password: z
    .string()
    .nonempty("Campo obrigatório")
    .max(8, "Máximo de 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), { message: "Deve conter ao menos 1 letra maiúscula" })
    .refine((val) => /[0-9]/.test(val), { message: "Deve conter ao menos 1 número" })
    .refine((val) => /[@#$?]/.test(val), { message: "Deve conter ao menos 1 caractere especial (@, #, $, ?)" }),
  confirmPassword: z.string().nonempty("Campo obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

function maskInput(value, field) {
  const onlyDigits = value.replace(/\D/g, '');

  if (field === "cpf") {
    const cpf = onlyDigits.slice(0, 11);
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  if (field === "cnpj") {
    const cnpj = onlyDigits.slice(0, 14);
    return cnpj
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  }

  if (field === "phone") {
    if (onlyDigits.length > 10) {
      return onlyDigits
        .replace(/^(\d{2})(\d{1})(\d{4})(\d{4}).*/, '($1) $2 $3-$4')
        .replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
    }
    return onlyDigits
      .replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3')
      .replace(/^(\d{2})(\d{0,4})(\d{0,4})/, (match, ddd, first, last) => {
        if (!first) return ddd ? `(${ddd}` : '';
        if (!last) return `(${ddd}) ${first}`;
        return `(${ddd}) ${first}-${last}`;
      });
  }

  return value;
}