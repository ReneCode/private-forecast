//

export type UserType = {
  id: string;
  name: string;
};

const LOCAL_STORAGE_KEY = "private-forecast";

export const getDate = (dayDelta: number = 0) => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000 * dayDelta);
};

export const dateToDateId = (dt: Date): string => {
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()}`;
};

export const loadUserFromLocalStorage = (): UserType => {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (item) {
    const json = JSON.parse(item);
    if (json) {
      return {
        id: json.id,
        name: json.name,
      };
    }
  }
  return {
    id: "",
    name: "",
  };
};

export const saveUserToLoacalStorage = (user: UserType) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({ id: user.id, name: user.name })
  );
};
