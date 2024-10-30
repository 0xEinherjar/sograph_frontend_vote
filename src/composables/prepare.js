import { useUtils } from "../composables/utils.js";
const { toNumber } = useUtils();

export const usePrepare = () => {
  async function fetchAndValidateMetadata(url) {
    if (!url.startsWith("https://ipfs.io/ipfs/")) return null;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao buscar metadata");
    const metadata = await response.json();
    return metadata;
  }

  function processProfileData(data, metadata) {
    return {
      avatar:
        metadata.avatar && metadata.avatar.startsWith("https://ipfs.io/ipfs/")
          ? metadata.avatar
          : null,
      name: metadata.name,
      description: metadata.description,
      handle: data.handle,
      hasSubscription: data.hasSubscription,
      following: toNumber(data.following),
      followers: toNumber(data.followers),
      biography: metadata.biography,
      location: metadata.location,
      createdAt: metadata.created_at,
      links: metadata.links,
    };
  }

  async function profile(data) {
    const metadata = await fetchAndValidateMetadata(data.metadata);
    if (!metadata) return null;
    return processProfileData(data, metadata);
  }

  return { profile };
};
