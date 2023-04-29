import { Card, Spacer, Button, Text, Input, Container } from '@nextui-org/react';

const LoginForm = () => {
  return (
    <div>
      <Container display="flex" alignItems="center" justify="center" css={{ minHeight: '100vh' }}>
        <Card css={{ mw: '420px', p: '20px' }} variant="bordered">
          <Text size={24} weight="bold" css={{ as: 'center', mb: '20px' }}>Log In</Text>
          <Input clearable bordered fullWidth color="primary" size="lg" placeholder="Email" />
          <Spacer y={1} />
          <Input clearable bordered fullWidth color="primary" size="lg" placeholder="Password" css={{ mb: '6px' }} />
          <Spacer y={1} />
          <Button>Sign in</Button>
        </Card>
      </Container>
    </div>
  );
}

export default LoginForm;