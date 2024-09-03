import CardWrapper from "@/components/auth/card-wrapper";
// import { useForm } from "react-hook-form";

const LoginForm = () => {
  // const form = useForm;
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don`t have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      login FOrm
    </CardWrapper>
  );
};

export default LoginForm;
