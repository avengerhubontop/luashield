
interface UploadParams {
  token: string;
  username: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
}

export const uploadToGitHub = async ({ token, username, repo, branch, path, content, message }: UploadParams) => {
  const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
  
  // 1. Check if file exists to get SHA (for updates)
  let sha: string | undefined;
  try {
    const checkReq = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    if (checkReq.ok) {
      const data = await checkReq.json();
      sha = data.sha;
    }
  } catch (e) {
    console.warn("File check failed, assuming new file", e);
  }

  // 2. Upload (PUT)
  const body: any = {
    message: message,
    content: btoa(content), // Base64 encode
    branch: branch
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to upload to GitHub');
  }

  return await response.json();
};
