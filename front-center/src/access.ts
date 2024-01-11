import {localCache} from "@/utils/cache";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const {currentUser} = initialState ?? {};
  const permission = localCache.getCache("permission");
  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    canAdmin: permission && permission[0] === "ROOT"
  };
}
