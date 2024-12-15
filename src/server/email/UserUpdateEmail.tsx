import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface UserUpdateEmailProps {
  name: string;
  majors: string[];
  expectedGraduationMonth: string;
  expectedGraduationYear: number;
}

export const UserUpdateEmail = ({
  name,
  majors,
  expectedGraduationMonth,
  expectedGraduationYear,
}: UserUpdateEmailProps) => {
  const previewText = `Hello ${name}, your account has been updated.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Your Plan4CU account has been updated.
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Your account has been updated with the following information:
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Majors:</strong>
              <ul>
                {majors.map((major) => (
                  <li key={major}>{major}</li>
                ))}
              </ul>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Expected graduation:</strong>
              {expectedGraduationMonth} {expectedGraduationYear}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserUpdateEmail;
