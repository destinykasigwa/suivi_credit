@include('partials.header')
@include('partials.sidebar')
<div class="content-wrapper content"
    style="background: #fff; background-image: url('{{ asset('images/bg3.jpeg') }}');background-repeat: no-repeat;
      background-repeat: no-repeat;
  background-size: 300% 100%;">
    <section class="content">
        <div class="wrapper">
            <div class="row">
                {{-- <h1>Bonjour</h1> --}}
                <h6 class="text-center" style="border-radius:0px;
            background: #e0e0ea;">
                    <?php
                    $dateSaisie = DB::select('SELECT DateSystem FROM taux_et_date_systems ORDER BY id DESC LIMIT 1')[0];
                    $userInfo = DB::select('SELECT * FROM users WHERE id="' . Auth::user()->id . '"')[0];
                    ?> <strong style="color: brown">Date Système:<?php $dataDuJour = date_create($dateSaisie->DateSystem); ?>
                        {{ date_format($dataDuJour, 'd/m/Y') }}</strong></h6>

                <div class="col text-center">
                    <img height="150" width="300" src="{{ asset('images/image_house_hand.png') }}" alt="">
                </div>
            </div>
        </div>
    </section>
</div>
@include('partials.footer')
