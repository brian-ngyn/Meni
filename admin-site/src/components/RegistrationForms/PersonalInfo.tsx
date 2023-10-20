import MeniTextInput from "~/components/items/MeniTextInput";

type PersonalInfoProps = {
  firstName: string;
  lastName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PersonalInfo: React.FunctionComponent<PersonalInfoProps> = (props) => {
  const { firstName, lastName, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <div className="font-sans" id="edit-personal-section">
      <h1 className="my-6 text-2xl">Personal Information</h1>
      <div className="grid grid-cols-1 grid-rows-2 gap-10 md:grid-cols-2 md:grid-rows-1">
        <MeniTextInput
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={handleChange}
          title="First Name"
          validate={{
            required: true,
            pattern: /^[A-Za-z]{1,30}$/i,
            errorMessages: {
              required: "First name is required",
              pattern: "First name is not valid",
            },
          }}
        />
        <MeniTextInput
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={handleChange}
          title="Last Name"
          validate={{
            required: true,
            pattern: /^[A-Za-z]{1,30}$/i,
            errorMessages: {
              required: "Last name is required",
              pattern: "Last name is not valid",
            },
          }}
        />
        {/* <MeniTextInput
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          title="Email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          validate={{
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
            errorMessages: {
              required: "Email is required",
              pattern: "Email is not valid",
            },
          }}
        />
        <MeniTextInput
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          title="Password"
          validate={{
            required: true,
            pattern: /^[A-Za-z0-9]{6,30}$/,
            errorMessages: {
              required: "Password is required",
              pattern: "Password is not valid",
            },
          }}
        /> */}
      </div>
    </div>
  );
};

export default PersonalInfo;
