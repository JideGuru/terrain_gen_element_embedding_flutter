import 'dart:async';

import 'package:flutter/material.dart';
import 'package:js/js.dart' as js;
import 'package:js/js_util.dart' as js_util;
import 'package:web_embed_test/glow_stuff/glow_stuff.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

@js.JSExport()
class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  final _streamController = StreamController<void>.broadcast();
  late AnimationController animationController;
  double _speed = 0.1;
  int _rotation = 70;

  @override
  void initState() {
    super.initState();
    final export = js_util.createDartExport(this);
    js_util.setProperty(js_util.globalThis, '_appState', export);
    js_util.callMethod<void>(js_util.globalThis, '_stateSet', []);
    animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );
  }

  @override
  void dispose() {
    _streamController.close();
    super.dispose();
  }

  @js.JSExport()
  void addHandler(void Function() handler) {
    _streamController.stream.listen((event) {
      handler();
    });
  }

  @js.JSExport()
  double get speed => _speed;

  @js.JSExport()
  int get rotation => _rotation;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text('Terrain Generation W/ Glow stuff and Element Embedding'),
      ),
      body: Stack(
        children: [
          // I used @renancaraujo's glow stuff for the moon
          // https://github.com/renancaraujo/glow_stuff_with_flutter
          Positioned(
            top: -70,
            left: 0,
            right: 0,
            child: ApplyGlow(
              density: 0.9,
              child: SizedBox(
                height: 500,
                width: 300,
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.topCenter,
                      child: Container(
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        height: 200,
                        width: 200,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: kToolbarHeight + 10,
            right: 0,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(1, 0),
                end: Offset.zero,
              ).animate(animationController),
              child: Container(
                width: 250,
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius:
                      const BorderRadius.horizontal(left: Radius.circular(10)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.shade200,
                      blurRadius: 3,
                      offset: const Offset(3, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 40),
                    Padding(
                      padding: const EdgeInsets.only(left: 20),
                      child: Text('Speed: ${_speed.toStringAsFixed(2)}'),
                    ),
                    Slider(
                      value: _speed,
                      onChanged: (val) {
                        _speed = val;
                        setState(() {});
                        _streamController.add(null);
                      },
                      min: -.3,
                      max: .3,
                    ),
                    const SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.only(left: 20),
                      child: Text('Rotation: $_rotation'),
                    ),
                    Slider(
                      value: _rotation.toDouble(),
                      onChanged: (val) {
                        _rotation = val.toInt();
                        setState(() {});
                        _streamController.add(null);
                      },
                      min: 0,
                      max: 90,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (animationController.isCompleted) {
            animationController.reverse();
          } else {
            animationController.forward();
          }
        },
        tooltip: 'Increment',
        child: const Icon(Icons.edit),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
