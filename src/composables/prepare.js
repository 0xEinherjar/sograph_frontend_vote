import { useUtils } from "../composables/utils.js";
const { toNumber } = useUtils();

export const usePrepare = () => {
  const isValidIPFSUrl = (url) => url?.startsWith("https://ipfs.io/ipfs/");

  async function profile(data) {
    const metadataURL = data[0];

    if (!isValidIPFSUrl(metadataURL)) return null;
    const metadata = await fetch(metadataURL).then((response) =>
      response.json()
    );
    const avatar = isValidIPFSUrl(metadata.avatar) ? metadata.avatar : null;
    return {
      avatar: avatar,
      name: metadata.name,
      description: metadata.description,
      handle: data[1],
      hasSubscription: data[4],
      following: toNumber(data[2]),
      followers: toNumber(data[3]),
      biography: metadata.biography,
      location: metadata.location,
      createdAt: metadata.created_at,
      links: metadata.links,
    };
  }

  return { profile };
};
