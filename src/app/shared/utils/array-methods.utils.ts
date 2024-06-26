
// Common method to sorting the arra of objects
export const arrayObjectSort = (data: any[], sortBy: string, isAsc: boolean) => {
    if (data?.length) {
        if (isAsc) {
            return data.sort((item1, item2) => (item1[sortBy] < item2[sortBy]) ? 1 : -1);
        } else {
            return data.sort((item1, item2) => (item1[sortBy] > item2[sortBy]) ? 1 : -1);
        }
    }
    else {
        return data;
    }
}
