export default function HangmanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Hangman Game</title>
        <meta name="description" content="hangman game" />
      </head>
      <body>{children}</body>
    </html>
  );
}
