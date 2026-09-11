import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import IgmHomePrivacyPolicy from "./pages/IgmHomePrivacyPolicy";
import IgmHomeManagerPrivacyPolicy from "./pages/IgmHomeManagerPrivacyPolicy";
import HcAppPrivacyPolicy from "./pages/HcAppPrivacyPolicy";
import DeleteAccount from "./pages/DeleteAccount";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/igm-home" component={IgmHomePrivacyPolicy} />
      <Route path="/igm-home-manager" component={IgmHomeManagerPrivacyPolicy} />
      <Route path="/hc-app" component={HcAppPrivacyPolicy} />
      <Route path="/delete-account" component={DeleteAccount} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
