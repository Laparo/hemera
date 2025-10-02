"use client";
import * as React from "react";
import { signIn } from "next-auth/react";
import { Button, Container, Stack, Typography, Divider } from "@mui/material";

export default function SignInPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Anmelden
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Wähle einen Anbieter für die Anmeldung.
      </Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => signIn("email")}>Mit E‑Mail anmelden</Button>
        <Divider flexItem>oder</Divider>
        <Button variant="outlined" onClick={() => signIn("google")}>Mit Google</Button>
        <Button variant="outlined" onClick={() => signIn("apple")}>Mit Apple</Button>
        <Button variant="outlined" onClick={() => signIn("instagram")}>Mit Instagram</Button>
        <Button variant="text" onClick={() => signIn("e2e-credentials")}>E2E Test Login (Credentials)</Button>
      </Stack>
    </Container>
  );
}
