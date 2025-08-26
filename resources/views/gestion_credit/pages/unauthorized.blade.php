@include('partials-gc.header')
@include('partials-gc.sidebar')
<div class="content-wrapper">
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="container">
                    <h1>Accès Refusé</h1>
                    <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
                    <a href="{{ url('/gestion_credit/home') }}" class="btn btn-primary">Retour à l'accueil</a>
                </div>
            </div>
        </div>
    </section>
</div>

@include('partials-gc.footer')
