// Test file to verify AI components with fallback mechanisms
import AIChat from "@/components/pages/ai-chat";
import IndustrialExchange from "@/components/pages/industrial-exchange";

export default function TestAIComponents() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Components Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">TrashGPT Test</h2>
          <AIChat />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Industrial Exchange AI Test</h2>
          <IndustrialExchange />
        </div>
      </div>
    </div>
  );
}