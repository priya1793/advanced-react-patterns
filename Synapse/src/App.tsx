import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SynapseEditor } from "./components/SynapseEditor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SynapseEditor />
    </QueryClientProvider>
  );
}
