export interface SignUpUserType {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  city: string;
  pincode: string;
  countryandstate: [string, string];
  isAccepted: boolean;
}
