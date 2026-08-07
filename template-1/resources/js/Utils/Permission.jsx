import { useAuthorization } from "./authorization";

export default function useHasAnyPermission(permissions, givenPermissions = null) {
    const { canAny } = useAuthorization();

    if (givenPermissions) {
        return (
            permissions.some((permission) => givenPermissions?.[permission] === true)
        );
    }

    return canAny(permissions);
}
