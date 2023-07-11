import { Container } from "@/components/shared/PageLayout";

export default function VersesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container>{children}</Container>;
}
