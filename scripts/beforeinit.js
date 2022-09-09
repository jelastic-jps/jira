import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;

var client = new HttpClient(),
  getAuthMethod,
  getExecMethod,
  response,
  authUrl,
  execUrl,
  status,
  token,
  resp,
  tag;

authUrl = "https://auth.docker.io/token?service=registry.docker.io&scope=repository:atlassian/jira-software:pull";
execUrl = "https://registry-1.docker.io/v2/atlassian/jira-software/tags/list";
getAuthMethod = new GetMethod(authUrl);
status = client.executeMethod(getAuthMethod);
resp = getAuthMethod.getResponseBodyAsString();
resp = JSON.parse(resp);
token = resp.token;
getExecMethod = new GetMethod(execUrl);
getExecMethod.setRequestHeader("Authorization", "Bearer " + token);
client.executeMethod(getExecMethod);
resp = getExecMethod.getResponseBodyAsString();
resp = JSON.parse(resp);
tags = resp.tags;

var tagsLength = tags.length;
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

function getVersions(edition, url) {
var body = String(new com.hivext.api.core.utils.Transport().get(url));
var length = body.length;
var arr = typeof JSON !== "undefined" ? JSON.parse(body.substring(10, length -1)) : eval(toNative(body).substring(10, body.length - 1));
for (var i in arr) {
  if (arr[i].edition == edition && arr[i].platform == "Unix") {
      if (edition == "Standard") { 
          caption = "Latest";
      } else { 
          caption = "Long Term Support";
          jps.settings.fields[0]["default"] = arr[i].version;
      }
      for (var k = 0, l = tagsLength; k < l; k++) {
        if (tags[k] == arr[i].version) {
        api.marketplace.console.WriteLog(tags[k].name);
          values.push({ caption: arr[i].version+' '+'('+caption+')',value: arr[i].version });
          break;
        }
      }
      break;
  }
}
}

if (values.length > 0) {  
    return { result: 0, settings: jps.settings };    
}


function err(e, text, cur, override){
    var m = (e.quota.description || e.quota.name) + " - " + e.value + ", " + text + " - " + cur + ". ";
    if (override) markup = m; else markup += m;
}

return { result: 1099, error:"can't determine latest or lts version", versions: values };
