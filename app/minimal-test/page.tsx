export default function MinimalTest() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Minimal Test Page</h1>
        <div className="p-6 bg-card/40 backdrop-blur-md border border-border/50 rounded-lg">
          <p className="text-lg text-foreground">Frontend is working correctly!</p>
        </div>
        <p className="text-foreground">
          If you can see this page, the frontend is functioning properly. 
          The performance issues might be related to the complex components on the main dashboard.
        </p>
      </div>
    </div>
  )
}