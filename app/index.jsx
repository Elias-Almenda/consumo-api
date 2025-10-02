import { useEffect, useState } from 'react'
import { ScrollView, Text, Image, View, StyleSheet } from 'react-native'

export default function SplashScreen(){
    const apiLink = "https://www.fabiooliveira.cloud/api_aula/filmes/"
    const [Filmes, SetFilme] = useState([])
    useEffect(() => {
        fetch(apiLink, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': 'a8ea3f9c1e47b2d89f0d41b7f3c2d0c6'
            },
        })
            .then((res) => res.json())
            .then((data) => SetFilme(data))
            .catch((err) => console.error(err));
    }, []);
    console.warn(Filmes)
    return(
        <View style={Styles.BodyView}>
            <Text style={Styles.TextTitulo}>
                Filmes da Marvel
            </Text>
            
            <ScrollView contentContainerStyle={Styles.ScrollViewContent}> 
                {Filmes.map((Filme) => {
                    return ( 
                        <View key={Filme.codFilme} style={Styles.ViewCard}>
                            <Image 
                                source={{uri: Filme.linkPoster}}
                                style={Styles.CardImage}
                            />
                            <Text style={Styles.CardText}>
                                {Filme.titulo}
                            </Text>
                            <Text style={Styles.CardText2}>
                                Franquia: {Filme.franquia}<br/>
                                Ano: {Filme.anoLancamento}
                            </Text>
                            <Text style={Styles.TextCard}>
                                R$ {parseInt(Filme.valorArrecadacao).toLocaleString('pt-BR')}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    )
}

const Styles = StyleSheet.create({
    BodyView: {
        flex: 1,
        backgroundColor: '#a11e1e',
        alignItems: 'center', 
        paddingTop: 30,
    },
    TextTitulo: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    ScrollViewContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBottom: 50,
        width: '100%',
    },
    ViewCard: {
        width: '40%',
        minHeight: 100, 
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        alignItems: 'left',
        textAlign: "left",
        boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.5)'
    },
    CardImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        borderRadius: 8,
        marginBottom: 5,
    },
    CardText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'left',
        marginTop: 5,
    },
    CardText2: {
        fontSize: 13,
        textAlign: 'left',
        color: "gray",
        marginTop: 5
    },
    TextCard: {
        fontWeight: "bold",
        fontSize: 16,
        color: "red"
    } 
})