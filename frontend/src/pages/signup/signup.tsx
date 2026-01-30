import {Signupform} from "../../components/signup-form"

function Signup() {
  return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl md:max-w-4xl">
        <Signupform />
      </div>
    </div>
  )
}

export default Signup
