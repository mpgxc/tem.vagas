import { render } from '@react-email/components';
import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

type WelcomeEmailProps = {
  username?: string;
};

export const welcomeEmailRender = async (args: WelcomeEmailProps) => {
  const html = await render(<WelcomeEmail {...args} />);

  const text = await render(<WelcomeEmail {...args} />, {
    plainText: true,
    pretty: true,
  });

  return { html, text };
};

export const WelcomeEmail = ({ username }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo à Tem Vagas!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Olá {username},</Text>
            <Text style={paragraph}>
              Bem-vindo à Tem Vagas! Estamos muito felizes em tê-lo(a) conosco.
            </Text>
            <Text style={paragraph}>
              Para começar, recomendamos que você explore nossa plataforma e
              descubra todos os recursos incríveis que oferecemos.
            </Text>
            <Text style={paragraph}>
              Se você tiver alguma dúvida ou precisar de ajuda, não hesite em
              entrar em contato com o{' '}
              <Link href="#" style={link}>
                Suporte da Tem Vagas
              </Link>
              .
            </Text>
            <Text style={paragraph}>
              Obrigado,
              <br />
              Equipe de Suporte da Tem Vagas
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: 'center', color: '#706a7b' }}>
              © 2022 Tem Vagas, Todos os Direitos Reservados <br />
              246, Av. Duque de Caxias, Centro, Oeiras - PI, 64500-000
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
};

const footer = {
  maxWidth: '580px',
  margin: '0 auto',
};

const content = {
  padding: '5px 20px 10px 20px',
};

const link = {
  textDecoration: 'underline',
};
