**Jira Software application**: [${globals.protocol}://${env.domain}](${globals.protocol}://${env.domain})  

Please be patient, application startup takes time.

Database access credentials:    
  **Hostname**: node${nodes.sqldb.master.id}-${env.domain}  
  **Username**: ${globals.dbUser}  
  **Password**: ${globals.dbPasswd}  
  **Database name**: ${globals.dbName}  

The instructions below can help you with further managing your Jira tracking system:

* [Attach Public IP](https://docs.jelastic.com/public-ip)
* [Bind custom domain](https://docs.jelastic.com/custom-domains/#configure-dns)
* [Share access to the environment](http://docs.jelastic.com/share-environment)
* [Adjust automatic vertical scaling settings](http://docs.jelastic.com/automatic-vertical-scaling)
* [Monitor the statistics](http://docs.jelastic.com/view-app-statistics) & [view log files](https://docs.jelastic.com/view-log-files)
* [Access environment via SSH](https://docs.jelastic.com/ssh-access)
