import axios from "axios";

export async function getInstagramFollowerCount(name: string) {
  try {
    const response: any = await axios.get(
      `https://www.instagram.com/${name}/?__a=1`
    );

    console.log(response);

    const value = response.data.graphql.user.edge_followed_by.count;

    if (!value) {
      throw "Erro ao buscar quantidade de seguidores";
    }

    return value;
  } catch (error) {
    console.log(error);
    return error;
  }
}
