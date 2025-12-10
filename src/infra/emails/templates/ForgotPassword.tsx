import {
  Column,
  Heading,
  Html,
  Row,
  Section,
  Tailwind,
} from "@react-email/components";

interface IForgotPassword {
  confirmationCode: string;
}

export default function ForgotPassword({ confirmationCode }: IForgotPassword) {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                foodiary: {
                  green: "#64A30D",
                },
                gray: {
                  600: "#A1A1AA",
                },
              },
            },
          },
        }}
      >
        <Section>
          <Row>
            <Column className="font-sans text-center">
              <Heading as="h1" className="text-2xl leading-[0]">
                Recupere a sua conta
              </Heading>
              <Heading as="h2" className="font-normal text-lg text-gray-600">
                Recupere a sua senha e volte ao foco 🚀
              </Heading>
            </Column>
          </Row>

          <Row>
            <Column className="text-center pt-4">
              <span className="bg-gray-200 inline-block px-8 py-4 text-center text-3xl font-sans rounded-md font-bold tracking-[16px]">
                {confirmationCode}
              </span>
            </Column>
          </Row>

          <Row>
            <Column className="font-sans text-center pt-10">
              <Heading as="h2" className="font-normal text-lg text-gray-600">
                Se voce nao solicitou a troca de senha, desconsidere esse codigo
              </Heading>
            </Column>
          </Row>
        </Section>
      </Tailwind>
    </Html>
  );
}

ForgotPassword.PreviewProps = {
  confirmationCode: "356878",
};
