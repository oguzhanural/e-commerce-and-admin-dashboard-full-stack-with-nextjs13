// ...safely access window object.
/*
bard.google.com
Buradaki hydration trick, useEffect() hook'unu kullanarak, window nesnesinin oluşturulduğundan emin olmak için kullanılan bir tekniktir.

window nesnesi, bir web sayfası yüklendiğinde oluşturulur. Ancak, bir web sayfası, yüklendikten sonra da yeniden yüklenebilir. Bu durumda, window nesnesi yeniden oluşturulmaz.

useOrigin() hook'u, window nesnesinden location.origin özelliğini alır. Bu özellik, web sayfasının kök URL'sini temsil eder.

useEffect() hook'unu kullanarak, window nesnesinin oluşturulduğundan emin olmak için setMounted() state değişkenini kullanırız. Bu değişken, true değerine ayarlanırsa, window nesnesi oluşturulmuştur.

useEffect() hook'unun deps parametresine boş bir dizi göndeririz. Bu, useEffect() hook'unun her render döngüsünde çalışmasını önler.

if (!mounted) koşulunu kullanarak, window nesnesinin oluşturulmadığı durumlarda origin değişkeninin boş bir değer döndürmesini sağlarız.

Bu tekniğin amacı, window nesnesinin oluşturulmadığı durumlarda, origin değişkeninin boş bir değer döndürmesini sağlamaktır. Bu, bazı durumlarda, özellikle de web sayfası yeniden yüklendiğinde, origin değişkeninin hatalı bir değer döndürmesini önlemeye yardımcı olur.
*/

import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true); //hydration trick
    }, []); 

    if (!mounted) {
        return '';
    }

    return origin;
} 

