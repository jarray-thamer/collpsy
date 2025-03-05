import ConfirmResetPasswordForm from "./confirmResetPasswordForm";

const page = () => {
  return (
    <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold text-primary">Reset Password</h1>
        <p className="text-muted-foreground">Confirm your new Password </p>
      </div>
      <div className="space-y-5">
        <ConfirmResetPasswordForm />
      </div>
    </div>
  );
};

export default page;