var values = jps.settings.fields[0].values,
    settings = jps.settings, fields = {},
    extIP = "environment.externalip.enabled",
    extIPperEnv = "environment.externalip.maxcount",
    extIPperNode = "environment.externalip.maxcount.per.node",
    markup = "", cur = null, text = "used", prod = true;
  
var quotas = jelastic.billing.account.GetQuotas(extIP + ";"+extIPperEnv+";" + extIPperNode).array;
for (var i = 0; i < quotas.length; i++){
  var q = quotas[i], n = toNative(q.quota.name);
  
  if (n == extIP &&  !q.value){
    err(q, "required", 1, true);
    prod = false; 
  }
    
  if (n == extIPperEnv && q.value < 1){
    if (!markup) err(q, "required", 1, true);
    prod = false;
  }

  if (n == extIPperNode && q.value < 1){
    if (!markup) err(q, "required", 1, true);
    prod = false;
  }
}

if (!prod) {  
  jps.settings.fields[1].markup = "Jira software is not available. " + markup + "Please upgrade your account.";
  jps.settings.fields[1].cls = "warning";
  jps.settings.fields[1].hidden = false;
  jps.settings.fields[1].height = 30;
  settings.fields.push(
    {"type": "compositefield","height": 0,"hideLabel": true,"width": 0,"items": [{"height": 0,"type": "string","required": true}]}
  );
}

getVersions("Standard",  "https://my.atlassian.com/download/feeds/current/jira-software.json");
getVersions("Enterprise", "https://my.atlassian.com/download/feeds/archived/jira-software.json");

if (values.length > 0) {  
  return { result: 0, settings: jps.settings };    
}

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

function err(e, text, cur, override){
  var m = (e.quota.description || e.quota.name) + " - " + e.value + ", " + text + " - " + cur + ". ";
  if (override) markup = m; else markup += m;
}
return { result: 1099, error:"can't determine latest or lts version", versions: values };
