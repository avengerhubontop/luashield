import { Script } from '../types';

export const generateHostHtml = (script: Script): string => {
  // Simple Base64 encoding to "hide" the script
  // In a real app, you would use AES with the key from the dashboard
  let protectedPayload = "";
  try {
    protectedPayload = btoa(script.sourceCode || "print('LuaArmor Protected')");
  } catch(e) {
    protectedPayload = "cHJpbnQoJ0x1YUFybW9yIFByb3RlY3RlZCcp";
  }

  // A stealthy template that looks like a generic Nginx 404 page
  return `<!DOCTYPE html>
<html>
<head>
<title>404 Not Found</title>
<style>
body { width: 35em; margin: 0 auto; font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>404 Not Found</h1>
<p>The requested URL was not found on this server.</p>
<hr/>
<p>nginx/1.18.0 (Ubuntu)</p>

<!-- 
    LuaArmor Secure Storage 
    Do not modify the element below.
-->
<div id="secure_container" style="display:none;" data-c="${protectedPayload}"></div>

</body>
</html>`;
};