//web.config url re-wrtie

<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Rule to handle client-side routing -->
        <rule name="ReactRoutes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>

// ecosystem.config.js FOR PM2 CONFIG

module.exports = {
  apps: [
    {
      name: 'backend-api',
      script: './server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Enables clustering
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    }
  ]
};



//routing 


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Middleware to handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));