import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
  } from '@mantine/core';
  import classes from './AuthenticationTitle.module.css';
  import { signIn, signUp } from '@/server/users';
  import { useRouter } from 'next/navigation';
  import { useState } from 'react';
  import { toast } from 'react-toastify';

  export function AuthenticationTitle() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignIn = async () => {
      try {
        await signIn(email, password);
        router.push("/dashboard"); 
      } catch (error) {
        console.error("Sign in failed:", error);
        toast.error("Sign in failed. Please check your credentials.")
      }
    };

    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>
  
        <Text className={classes.subtitle}>
          Do not have an account yet? <Anchor onClick={signUp}>Create account</Anchor>
        </Text>
  
        <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
          <TextInput 
            label="Email" 
            placeholder="you@mantine.dev" 
            required radius="md" 
            onChange={(e) => setEmail(e.currentTarget.value)} />
          <PasswordInput 
            label="Password" 
            placeholder="Your password" 
            required mt="md" 
            radius="md" 
            onChange={(e) => setPassword(e.currentTarget.value)}/>
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" radius="md" onClick={handleSignIn}>
            Sign in
          </Button>
        </Paper>
      </Container>
    );
  }