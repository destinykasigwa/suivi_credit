<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>INFOMAIL</title>
</head>

<body>
    <h1>RECUPERATION DE MOT DE PASSE</h1>
    <hr>
    {{-- <p>Bonjour {{ $user->name }} votre role est {{ $user->Role }} </p> --}}
    <div style="background: #0C426E;color:aliceblue;padding:20px;border:4px solid #dcdcdc">
        <p>{{ $data }} </p>
        <br>
        <div style="margin: 0px auto;width:600px">
            <h1>{{ $code }}</h1>
        </div>

    </div>

</body>
<br><br>
<p style="color: #dcdcdc">
    C'est mail vous ai envoyé automatiquement!
</p>

</html>
