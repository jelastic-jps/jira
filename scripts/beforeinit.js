var values = jps.settings.fields[0].values;
  
function getVersions(edition, url) {
  var body = toNative(new com.hivext.api.core.utils.Transport().get(url));
  var arr = eval(body.substring(10, body.length - 1)); 
  for (var i in arr) {
    if (arr[i].edition == edition && arr[i].platform == "Unix") {
        if (edition == "Standard") { 
            caption = "Latest";
        } else { 
            caption = "Long Term Support";
            jps.settings.fields[0]["default"] = arr[i].version;
        }
        values.push({ caption: arr[i].version+' '+'('+caption+')',value: arr[i].version });       
        break;
    }
  }
}
  
getVersions("Standard",  "https://my.atlassian.com/download/feeds/current/jira-software.json");
getVersions("Enterprise", "https://my.atlassian.com/download/feeds/archived/jira-software.json");
  
if (values.length > 0) {  
  return { result: 0, settings: jps.settings };    
}

return { result: 1099, error:"can't determine latest or lts version", versions: values };
