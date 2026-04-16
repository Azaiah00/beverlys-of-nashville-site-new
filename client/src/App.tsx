import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public site
import Home from "./pages/Home";
import Academy from "./pages/Academy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FreeGuide from "./pages/FreeGuide";
import TheReveal from "./pages/TheReveal";

// Auth + paywall
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";

// Portal
import PortalHome from "./pages/portal/PortalHome";
import Library from "./pages/portal/Library";
import Account from "./pages/portal/Account";
import Progress from "./pages/portal/Progress";

// Products
import MasterColoristsCheatSheet from "./pages/portal/products/MasterColoristsCheatSheet";
import PricingProfitPlaybook from "./pages/portal/products/PricingProfitPlaybook";
import SilkPressBlueprint from "./pages/portal/products/SilkPressBlueprint";
import SalonOwnerPlaybook from "./pages/portal/products/SalonOwnerPlaybook";
import WigConstructionCompanion from "./pages/portal/products/WigConstructionCompanion";
import HairColorMasteryGuide from "./pages/portal/products/HairColorMasteryGuide";
import ConsultationVault from "./pages/portal/products/ConsultationVault";

// Tools
import ColorFormulator from "./pages/portal/tools/ColorFormulator";
import ConsultationDecisionTree from "./pages/portal/tools/ConsultationDecisionTree";

function Router() {
  return (
    <Switch>
      {/* Public site */}
      <Route path="/" component={Home} />
      <Route path="/the-reveal" component={TheReveal} />
      <Route path="/academy" component={Academy} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/free-guide" component={FreeGuide} />

      {/* Auth + paywall */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/pricing" component={Pricing} />

      {/* Portal — login required, admins bypass all paywalls */}
      <Route path="/portal">
        {() => (
          <ProtectedRoute>
            <PortalHome />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/library">
        {() => (
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/progress">
        {() => (
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/account">
        {() => (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        )}
      </Route>

      {/* Products */}
      <Route path="/portal/products/master-colorists-cheat-sheet">
        {() => (
          <ProtectedRoute requireProduct="master-colorists-cheat-sheet">
            <MasterColoristsCheatSheet />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/products/pricing-profit-playbook">
        {() => (
          <ProtectedRoute requireProduct="pricing-profit-playbook">
            <PricingProfitPlaybook />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/products/silk-press-blueprint">
        {() => (
          <ProtectedRoute requireProduct="silk-press-blueprint">
            <SilkPressBlueprint />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/products/salon-owners-launch-kit">
        {() => (
          <ProtectedRoute requireProduct="salon-owners-launch-kit">
            <SalonOwnerPlaybook />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/products/wig-construction-companion">
        {() => (
          <ProtectedRoute requireProduct="wig-construction-companion">
            <WigConstructionCompanion />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/products/hair-color-mastery-guide">
        {() => (
          <ProtectedRoute requireProduct="hair-color-mastery-guide">
            <HairColorMasteryGuide />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/products/consultation-vault">
        {() => (
          <ProtectedRoute requireProduct="consultation-vault">
            <ConsultationVault />
          </ProtectedRoute>
        )}
      </Route>

      {/* Tools — Artisan+ */}
      <Route path="/portal/tools/formulator">
        {() => (
          <ProtectedRoute requireProduct="color-formulator">
            <ColorFormulator />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/portal/tools/consultation">
        {() => (
          <ProtectedRoute requireProduct="consultation-decision-tree">
            <ConsultationDecisionTree />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
