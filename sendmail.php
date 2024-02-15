<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('info@hotel-pushkin-ufa.ru', 'Пушкин Бутик-Отель'); // Указать нужный E-mail
	//Кому отправить
	
	$mail->addAddress('ufahata@gmail.com');
	//Тема письма
	$mail->Subject = 'Заявка с сайта Пушкин Бутик-Отель';
	// $contact_name = $_POST['name'];
	//$contact_phone = $_POST['phone'];
	//if(!$contact_name || !$contact_phone) return;
	//Тело письма
	$body = '<h1>Заявка с сайта Пушкин Бутик-Отель</h1>';
	if(trim(!empty($_POST['formName']))){
		$body.='<p><strong>Название формы:</strong> '.$_POST['formName'].'</p>';
	}
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['phone']))){
		$phone = trim($_POST['phone']);
		$body.='<p><strong>Телефон:</strong> '.$phone.'</p>';
		$letters = hasOnlyLetters($phone);
	}	
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Вопрос:</strong> '.$_POST['message'].'</p>';
	}

	function is_url($url) {
		return preg_match("/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/", $url);
	}

	function hasOnlyLetters($str){
		$str = preg_replace('/\s+/', '', $str);
		return preg_match('/^[a-z]+$/i', $str);
	}

	/*
	//Прикрепить файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//путь загрузки файла
		$filePath = __DIR__ . "/files/sendmail/attachments/" . $_FILES['image']['name']; 
		//грузим файл
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			$body.='<p><strong>Фото в приложении</strong>';
			$mail->addAttachment($fileAttach);
		}
	}
	*/

	$mail->Body = $body;

	$response = $_POST["g-recaptcha-response"];
	$url = 'https://www.google.com/recaptcha/api/siteverify';
	$data = array(
	    'secret' => '6Lcg3LUlAAAAACUT4TkA7wav5xDKAG6CQSEjimVI',
	    'response' => $_POST["g-recaptcha-response"]
	);
	$options = array(
	    'http' => array (
	        'method' => 'POST',
	        'content' => http_build_query($data)
	    )
	);
	$context  = stream_context_create($options);
	$verify = file_get_contents($url, false, $context);
	$captcha_success=json_decode($verify);

	if (($captcha_success->success==false) or (is_url($_POST['message'])) or $letters) {
		echo "Captcha wrong";
	} else if ($captcha_success->success==true) {
		//Отправляем
		if (!$mail->send()) {
			$message = 'Ошибка';
		} else {
			$message = 'Данные отправлены!';
		}

		$response = ['message' => $message];

		header('Content-type: application/json');
		echo json_encode($response);
	}
?>